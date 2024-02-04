export default (req: any, res: any) => {
  res.send = (data: any, statusCode: number = 200) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };
};
