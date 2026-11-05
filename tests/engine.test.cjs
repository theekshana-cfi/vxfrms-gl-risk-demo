const assert=require('node:assert/strict');
const {defaults,generate,evaluate}=require('../dist/engine.js');
const rows=generate();
assert.equal(rows.length,361);
assert.deepEqual(generate(),rows,'seed is deterministic');
assert.equal(evaluate(rows,defaults).length,8);
assert.equal(evaluate(rows,defaults.map(r=>({...r,enabled:false}))).length,0);
for(const rule of defaults){assert.ok(evaluate(rows,[rule]).length>0,rule.id+' has seeded evidence');}
const amount=defaults.find(r=>r.kind==='amount');
assert.equal(evaluate([{...rows[0],amount:amount.threshold}],[amount]).length,0);
assert.equal(evaluate([{...rows[0],amount:amount.threshold+1}],[amount]).length,1);
const ib=defaults.find(r=>r.kind==='interbranch');
assert.equal(evaluate([{...rows[0],amount:10000,counterpart:9000}],[ib]).length,0);
assert.equal(evaluate([{...rows[0],amount:10000,counterpart:8999}],[ib]).length,1);
const period=defaults.find(r=>r.kind==='period');
assert.equal(evaluate([{...rows[0],date:'2026-02-27',manual:true,amount:2000000}],[period]).length,1);
assert.equal(evaluate([{...rows[0],date:'2026-02-26',manual:true,amount:2000000}],[period]).length,0);
assert.equal(evaluate(rows,[defaults.find(r=>r.kind==='duplicate')]).length,2);
assert.equal(new Set(rows.map(t=>t.type)).size,36);
assert.equal(new Set(rows.map(t=>t.category)).size,13);
assert.equal(new Set(rows.map(t=>t.id)).size,rows.length);
for(const t of rows){const total=require('../dist/engine.js').journalTotals(t);assert.equal(total.balanced,true,t.id);assert.equal(total.debit,t.amount,t.id+' value counted once');assert.equal(total.credit,t.amount);assert.ok(t.lines.every(l=>(l.debit>0&&l.credit===0)||(l.credit>0&&l.debit===0)));assert.ok(t.sourceSystem&&t.counterparty&&t.operator&&t.approvalStatus);}
assert.ok(rows.some(t=>t.lines.length===3),'repayments split principal and interest');
console.log('All expanded ledger and rule tests passed.');
