const assert=require('node:assert/strict');
const {defaults,generate,evaluate}=require('../dist/engine.js');
const rows=generate();
assert.equal(rows.length,241);
assert.deepEqual(generate(),rows,'seed is deterministic');
assert.equal(evaluate(rows,defaults).length,7);
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
console.log('All engine tests passed.');
