(function(root){
const defaults=[
{id:'R01',name:'High-value journal',description:'Journal amount exceeds the configured LKR threshold.',kind:'amount',threshold:2000000,severity:'High',enabled:true},
{id:'R02',name:'Outside business hours',description:'Posting hour is before 08:00 or at/after the configured closing hour (Sri Lanka time).',kind:'hours',threshold:18,severity:'Medium',enabled:true},
{id:'R03',name:'Dormant account activity',description:'Account inactive for at least the configured number of days.',kind:'dormant',threshold:90,severity:'High',enabled:true},
{id:'R04',name:'Repeated reversal',description:'Reversal count on the original journal meets the threshold.',kind:'reversal',threshold:3,severity:'High',enabled:true},
{id:'R05',name:'Period-end adjustment',description:'Manual journal on final two calendar days exceeds threshold.',kind:'period',threshold:1000000,severity:'Medium',enabled:true},
{id:'R06',name:'Duplicate reference',description:'Same reference, account, branch, date and amount occurs more than once.',kind:'duplicate',threshold:2,severity:'High',enabled:true},
{id:'R07',name:'Interbranch imbalance',description:'Absolute difference between transfer and counterpart exceeds tolerance.',kind:'interbranch',threshold:1000,severity:'High',enabled:true}
];
const accounts={bank:'110100 · Cash at bank',cash:'110200 · Cash on hand',loans:'120100 · Customer loans',lease:'120200 · Lease receivables',hp:'120300 · Hire purchase receivables',interest:'120400 · Interest receivable',ecl:'129900 · Allowance for impairment',clearing:'130400 · Interbranch clearing',payment:'130500 · Payment settlement clearing',invest:'140100 · Treasury investments',ppe:'150100 · Property and equipment',depn:'159900 · Accumulated depreciation',prepaid:'160100 · Prepaid expenses',taxrec:'160200 · Tax receivable',savings:'210200 · Savings deposits',fd:'210300 · Fixed deposits',ipay:'210400 · Interest payable',accrual:'220100 · Accrued expenses',supplier:'220200 · Trade payables',taxpay:'220300 · Tax payable',funding:'230100 · Borrowings',capital:'310100 · Share capital',retained:'320100 · Retained earnings',dividend:'220400 · Dividends payable',income:'410100 · Interest income',fees:'420100 · Fee income',investinc:'430100 · Investment income',iexp:'510100 · Interest expense',payroll:'510200 · Payroll expense',opex:'510300 · Operating expenses',impair:'510400 · Impairment expense',depexp:'510500 · Depreciation expense',taxexp:'510600 · Tax expense',suspense:'170100 · Suspense account'};
const templates=[
['Loan disbursement','Lending','LMS','loans','bank','loans'],
['Loan repayment','Lending','LMS','bank','loans','loans'],
['Lease origination','Leasing','Leasing system','lease','bank','lease'],
['Lease instalment','Leasing','Leasing system','bank','lease','lease'],
['Hire purchase origination','Hire purchase','LMS','hp','bank','hp'],
['Savings deposit','Deposits','DMS','bank','savings','savings'],
['Savings withdrawal','Deposits','DMS','savings','bank','savings'],
['Fixed deposit placement','Deposits','DMS','bank','fd','fd'],
['Fixed deposit maturity','Deposits','DMS','fd','bank','fd'],
['Loan interest accrual','Interest & fees','LMS','interest','income','income'],
['Deposit interest accrual','Interest & fees','DMS','iexp','ipay','iexp'],
['Deposit interest payment','Interest & fees','DMS','ipay','bank','ipay'],
['Service fee collection','Interest & fees','Payments','bank','fees','fees'],
['Cash replenishment','Cash & payments','Cash operations','cash','bank','cash'],
['Payment settlement','Cash & payments','Payment switch','payment','bank','payment'],
['Interbranch transfer','Interbranch','Branch interface','clearing','bank','clearing'],
['Treasury security purchase','Treasury & funding','TMS','invest','bank','invest'],
['Investment income receipt','Treasury & funding','TMS','bank','investinc','investinc'],
['Borrowing drawdown','Treasury & funding','TMS','bank','funding','funding'],
['Funding repayment','Treasury & funding','TMS','funding','bank','funding'],
['Impairment provision','Impairment & recovery','ECL output','impair','ecl','impair'],
['Loan write-off','Impairment & recovery','LMS','ecl','loans','loans'],
['Recovery receipt','Impairment & recovery','LMS','bank','ecl','ecl'],
['Payroll payment','Payroll & expenses','Payroll','payroll','bank','payroll'],
['Supplier invoice','Payroll & expenses','Accounts payable','opex','supplier','opex'],
['Supplier payment','Payroll & expenses','Accounts payable','supplier','bank','supplier'],
['Expense accrual','Adjustments','Manual journal','opex','accrual','opex'],
['Prepayment recognition','Adjustments','Accounts payable','prepaid','bank','prepaid'],
['Fixed asset purchase','Fixed assets','Fixed asset register','ppe','bank','ppe'],
['Depreciation charge','Fixed assets','Fixed asset register','depexp','depn','depexp'],
['Tax accrual','Tax & equity','Tax schedule','taxexp','taxpay','taxexp'],
['Tax payment','Tax & equity','Tax schedule','taxpay','bank','taxpay'],
['Capital contribution','Tax & equity','Finance','bank','capital','capital'],
['Dividend declaration','Tax & equity','Finance','retained','dividend','dividend'],
['Suspense clearing','Adjustments','Manual journal','suspense','bank','suspense'],
['Accrual reversal','Adjustments','Manual journal','accrual','opex','opex']
].map(([type,category,sourceSystem,debit,credit,focus])=>({type,category,sourceSystem,debit,credit,focus}));
const branches=['Colombo','Kandy','Galle','Kurunegala','Jaffna','Negombo','Matara','Anuradhapura','Batticaloa','Pettah','Maharagama','Nugegoda'];
function withJournal(t,template){let a=t.amount,entries=[{account:accounts[template.debit],debit:a,credit:0},{account:accounts[template.credit],debit:0,credit:a}];if(['Loan repayment','Lease instalment'].includes(template.type)){let principal=Math.round(a*.8);entries=[{account:accounts.bank,debit:a,credit:0},{account:accounts[template.credit],debit:0,credit:principal},{account:accounts.income,debit:0,credit:a-principal}];}let focus=entries.find(x=>x.account===accounts[template.focus]);return {...t,type:template.type,category:template.category,sourceSystem:template.sourceSystem,account:accounts[template.focus],side:focus.debit?'Debit':'Credit',sourceReference:template.sourceSystem==='Manual journal'?'Manual supporting schedule':'SRC-'+t.reference,counterparty:'Synthetic '+template.category.toLowerCase()+' party '+String(+t.id.slice(3)%40+1).padStart(3,'0'),approvalStatus:t.manual?'Approved · manual checker':'Approved · source interface',checker:'DEMO-CHECKER-'+(+t.id.slice(3)%3+1),currency:'LKR',lines:entries.map((line,i)=>({...line,line:i+1,narration:t.description}))};}
function generate(){let seed=4201;const rand=()=>{seed=seed*16807%2147483647;return seed/2147483647};let rows=[];for(let i=0;i<360;i++){let template=templates[i%templates.length];rows.push({id:'GL-'+(10001+i),date:'2026-09-'+String(1+i%30).padStart(2,'0'),hour:9+i%8,branch:branches[i%branches.length],amount:Math.round((30000+rand()*850000)/100)*100,reference:'JRN-'+(70001+i),description:template.type+' · synthetic posting',manual:template.sourceSystem==='Manual journal',inactiveDays:0,reversals:template.type==='Accrual reversal'?1:0,counterpart:template.type==='Interbranch transfer'?0:null,operator:'DEMO-OP-'+(i%8+1),template});}
Object.assign(rows[8],{amount:4850000,hour:23,manual:true,template:templates.find(t=>t.type==='Suspense clearing'),description:'Manual suspense clearing · late posting'});
Object.assign(rows[21],{inactiveDays:146,amount:1650000,template:templates.find(t=>t.type==='Savings withdrawal'),description:'Withdrawal from dormant synthetic deposit account'});
Object.assign(rows[34],{reversals:4,manual:true,template:templates.find(t=>t.type==='Accrual reversal'),description:'Repeated reversal of expense accrual'});
Object.assign(rows[59],{amount:3250000,manual:true,template:templates.find(t=>t.type==='Expense accrual'),description:'Manual period-end expense accrual'});
Object.assign(rows[75],{amount:1800000,counterpart:1650000,template:templates.find(t=>t.type==='Interbranch transfer'),description:'Interbranch transfer · external counterpart difference'});
Object.assign(rows[122],{amount:8200000,manual:true,template:templates.find(t=>t.type==='Impairment provision'),description:'Manual impairment adjustment · synthetic overlay'});
rows=rows.map(t=>{if(t.template.type==='Interbranch transfer'&&t.counterpart===0)t.counterpart=t.amount;let {template,...header}=t;return withJournal(header,template)});rows.push({...structuredClone(rows[10]),id:'GL-10361',description:'Duplicate deposit interest accrual · synthetic duplicate'});return rows;}
function journalTotals(t){let debit=t.lines.reduce((s,l)=>s+l.debit,0),credit=t.lines.reduce((s,l)=>s+l.credit,0);return {debit,credit,balanced:Math.abs(debit-credit)<.005}}

function evaluate(rows,rules){return rows.flatMap(t=>{let hits=rules.filter(r=>{if(!r.enabled)return false;switch(r.kind){case'amount':return t.amount>r.threshold;case'hours':return t.hour<8||t.hour>=r.threshold;case'dormant':return t.inactiveDays>=r.threshold;case'reversal':return t.reversals>=r.threshold;case'period':{let day=+t.date.slice(-2);let last=new Date(+t.date.slice(0,4),+t.date.slice(5,7),0).getDate();return t.manual&&day>=last-1&&t.amount>r.threshold;}case'duplicate':return rows.filter(x=>x.reference===t.reference&&x.account===t.account&&x.branch===t.branch&&x.date===t.date&&x.amount===t.amount).length>=r.threshold;case'interbranch':return t.counterpart!==null&&Math.abs(t.amount-t.counterpart)>r.threshold;default:return false;}});return hits.length?[{...t,hits,severity:hits.some(r=>r.severity==='High')?'High':'Medium',score:Math.min(99,hits.reduce((s,r)=>s+(r.severity==='High'?45:25),0))}]:[];});}
const api={defaults,generate,evaluate,accounts,templates,branches,journalTotals};if(typeof module!=='undefined')module.exports=api;root.GL=api;
})(globalThis);
