import mysql from 'serverless-mysql';
const db = mysql({
  config: {
    host: 'containers-us-west-157.railway.app',
    port: '7815',
    database: 'railway',
    user: 'sqluser',
    password: 'password'
  }
});
export default async function executeQuery({ query, values }) {
  try {
    const results = await db.query(query, values);
   //clk console.log(query)
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}