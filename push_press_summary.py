import os, json, requests, datetime, io, csv
from zoneinfo import ZoneInfo
t=os.environ.get; NOTION_TOKEN=t('NOTION_TOKEN'); DB_KPI=t('NOTION_DB_KPI'); PAGE=t('NOTION_PAGE_PRESSKIT'); CONTACT=t('PRESS_CONTACT','press@example.com'); TH=float(t('BADGE_THRESHOLD_DAYS','30'))
H={'Authorization':f'Bearer {NOTION_TOKEN}','Notion-Version':'2022-06-28','Content-Type':'application/json'}
def q(db,p):
  r=requests.post(f'https://api.notion.com/v1/databases/{db}/query',headers=H,data=json.dumps(p)); assert r.status_code==200, r.text; return r.json()
def create_child(pid,title,children):
  r=requests.post('https://api.notion.com/v1/pages',headers=H,data=json.dumps({'parent':{'page_id':pid},'properties':{'title':{'title':[{'type':'text','text':{'content':title}}]}},'children':children})); assert r.status_code==200, r.text; return r.json()
def bounds():
  ct=ZoneInfo('America/Chicago'); now=datetime.datetime.now(ct); mon=(now-datetime.timedelta(days=now.weekday())).replace(hour=0,minute=0,second=0,microsecond=0); start=mon-datetime.timedelta(days=7); end=mon-datetime.timedelta(seconds=1); return start.isoformat(),end.isoformat()
def summarize(a,b):
  P=lambda a,b:{'filter':{'and':[{'property':'CreatedAt','date':{'on_or_after':a}},{'property':'CreatedAt','date':{'on_or_before':b}}]},'page_size':100}
  d=q(DB_KPI,P(a,b)); res=d.get('results',[]); events=len(res)
  dbr=q(DB_KPI,{'filter':{'and':[{'property':'Status','status':{'equals':'Breach'}},{'timestamp':'last_edited_time','date':{'on_or_after':a}},{'timestamp':'last_edited_time','date':{'on_or_before':b}}]},'page_size':100}); breaches=len(dbr.get('results',[]))
  vel=[]; cov=[]; priv=0
  for p in res:
    pr=p['properties'];
    v=pr.get('SettlementVelocityDays',{}).get('number'); s=pr.get('Status'); st=(s[s['type']]['name'] if s and s.get('type') in ('status','select') and s[s['type']] else None)
    if st=='Settled' and isinstance(v,(int,float)): vel.append(v)
    c=pr.get('RestitutionCoveragePct',{}).get('number');
    if isinstance(c,(int,float)): cov.append(c)
    sc=pr.get('PublicScope'); scn=(sc[sc['type']]['name'] if sc and sc.get('type') in ('status','select') and sc[sc['type']] else None)
    if scn=='Private': priv+=1
  avg=lambda L: round(sum(L)/len(L),2) if L else None
  priv_rate=round((priv/events)*100,2) if events else None
  buf=io.StringIO(); w=csv.writer(buf); w.writerow(['Metric','Value']); w.writerow(['EventsThisWeek',events]); w.writerow(['SettledAvgDays',avg(vel) if vel else '']); w.writerow(['RestitutionAvgPct',avg(cov) if cov else '']); w.writerow(['BreachCount',breaches]); w.writerow(['PrivateRatePct',priv_rate if priv_rate is not None else '']); csv_text=buf.getvalue()
  return {'events':events,'settled_avg':avg(vel),'coverage_avg':avg(cov),'breaches':breaches,'private_rate':priv_rate,'csv_text':csv_text}
def badge(u,th):
  return ('https://img.shields.io/badge/Reputation--Safe-Remedy%20In%20Progress-brightgreen?labelColor=1a1a1a&color=2aa84a&style=for-the-badge' if (u is not None and u < th) else 'https://img.shields.io/badge/Monitoring-Velocity%20%3E%3D%20threshold-lightgrey?labelColor=1a1a1a&color=808080&style=for-the-badge')
def main():
  assert NOTION_TOKEN and DB_KPI and PAGE
  a,b=bounds(); m=summarize(a,b); today=datetime.date.today().isoformat(); title=f'Consequence Ecology — Weekly Press Summary ({today})'
  intro='Consequence Ecology is a receipts-driven way to close loops with dignity. We pair Care + Proof to agree on a remedy, then time-box it until it posts. Cases remain private-by-default; when stories are shared, they use redacted, consent-scoped abstracts.'
  disc='Public communications use anonymized summaries only; raw receipts are never posted, and coercive or shaming uses are prohibited. This update is not legal advice and does not replace statutory process; adoption requires consent and respect for privacy, due process, and dignity.'
  cta=f'Press & pilot inquiries: {CONTACT}'
  bullets=[f'Events last week: {m['events']}', f"Avg. days to settlement (where settled): {m['settled_avg']}" if m['settled_avg'] is not None else 'Avg. days to settlement: —', f"Avg. restitution coverage: {m['coverage_avg']}%" if m['coverage_avg'] is not None else 'Avg. restitution coverage: —', f"Breaches edited last week: {m['breaches']}", f"Private handling rate: {m['private_rate']}%" if m['private_rate'] is not None else 'Private handling rate: —']
  children=[{'object':'block','type':'image','image':{'type':'external','external':{'url':badge(m['settled_avg'],TH)}}},{'object':'block','type':'paragraph','paragraph':{'rich_text':[{'type':'text','text':{'content':intro}}]}}]
  for line in bullets: children.append({'object':'block','type':'bulleted_list_item','bulleted_list_item':{'rich_text':[{'type':'text','text':{'content':line}}]}})
  children+= [{'object':'block','type':'paragraph','paragraph':{'rich_text':[{'type':'text','text':{'content':''}}]}},{'object':'block','type':'callout','callout':{'icon':{'emoji':'⚖️'},'rich_text':[{'type':'text','text':{'content':disc}}]}},{'object':'block','type':'callout','callout':{'icon':{'emoji':'✉️'},'rich_text':[{'type':'text','text':{'content':cta}}]}},{'object':'block','type':'code','code':{'language':'plain text','rich_text':[{'type':'text','text':{'content':m['csv_text']}}]}}]
  out=create_child(PAGE,title,children); print('Created press summary page:', out.get('id'))
if __name__=='__main__': main()
