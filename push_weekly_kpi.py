import os, json, requests, datetime
from zoneinfo import ZoneInfo
t=os.environ.get; NOTION_TOKEN=t('NOTION_TOKEN'); DB_KPI=t('NOTION_DB_KPI'); DB_SNAPSHOT=t('NOTION_DB_SNAPSHOT')
P_CREATED='CreatedAt'; P_STATUS='Status'; P_VEL='SettlementVelocityDays'; P_COV='RestitutionCoveragePct'; P_SCOPE='PublicScope'
H={'Authorization':f'Bearer {NOTION_TOKEN}','Notion-Version':'2022-06-28','Content-Type':'application/json'}
def q(db,p):
  r=requests.post(f'https://api.notion.com/v1/databases/{db}/query',headers=H,data=json.dumps(p));
  assert r.status_code==200, r.text; return r.json()
def create(db,props):
  r=requests.post('https://api.notion.com/v1/pages',headers=H,data=json.dumps({'parent':{'database_id':db},'properties':props}));
  assert r.status_code==200, r.text; return r.json()
def bounds():
  ct=ZoneInfo('America/Chicago'); now=datetime.datetime.now(ct); mon=(now-datetime.timedelta(days=now.weekday())).replace(hour=0,minute=0,second=0,microsecond=0);
  start=mon-datetime.timedelta(days=7); end=mon-datetime.timedelta(seconds=1); return start.isoformat(),end.isoformat()
def payload(a,b):
  return {'filter':{'and':[{'property':P_CREATED,'date':{'on_or_after':a}},{'property':P_CREATED,'date':{'on_or_before':b}}]},'page_size':100}
def num(p,n):
  try:
    v=p['properties'][n];
    return v['number'] if v['type']=='number' else None
  except KeyError:
    return None
def sel(p,n):
  try:
    v=p['properties'][n]; t=v['type']; o=v[t]; return o['name'] if o else None
  except KeyError:
    return None
def main():
  assert NOTION_TOKEN and DB_KPI and DB_SNAPSHOT
  a,b=bounds(); res=[]; d=q(DB_KPI,payload(a,b)); res+=d.get('results',[])
  while d.get('has_more'): d=q(DB_KPI,{**payload(a,b),'start_cursor':d['next_cursor']}); res+=d.get('results',[])
  events=len(res)
  d_b=q(DB_KPI,{'filter':{'and':[{'property':P_STATUS,'status':{'equals':'Breach'}},{'timestamp':'last_edited_time','date':{'on_or_after':a}},{'timestamp':'last_edited_time','date':{'on_or_before':b}}]},'page_size':100})
  breach=len(d_b.get('results',[]))
  vel=[]; cov=[]; priv=0
  for p in res:
    if sel(p,P_STATUS)=='Settled': v=num(p,P_VEL);  
    else: v=None
    if isinstance(v,(int,float)): vel.append(v)
    c=num(p,P_COV);  
    if isinstance(c,(int,float)): cov.append(c)
    if sel(p,P_SCOPE)=='Private': priv+=1
  avg=lambda L: round(sum(L)/len(L),2) if L else None
  today=datetime.date.today().isoformat(); priv_rate=round((priv/events)*100,2) if events else None
  props={'Name':{'title':[{'type':'text','text':{'content':f'Snapshot {today}'}}]},'SnapshotDate':{'date':{'start':today}},'EventsThisWeek':{'number':events},'SettledAvgDays':{'number':avg(vel)},'RestitutionAvgPct':{'number':avg(cov)},'BreachCount':{'number':breach},'PrivateRatePct':{'number':priv_rate},'Notes':{'rich_text':[{'type':'text','text':{'content':f'CT window: {a} -> {b}'}}]}}
  out=create(DB_SNAPSHOT,props); print('Created KPI snapshot:', out.get('id'))
if __name__=='__main__': main()
