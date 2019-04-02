import { createConnection } from 'mysql2';
import { environment } from '../config/secrets';

export class LambdaConnect {
  connection: any;
  constructor() {
    this.connection = createConnection({
      host: environment.db.host,
      user: environment.db.username,
      database: environment.db.database,
      password: environment.db.password,
      ssl: environment.production ? 'Amazon RDS' : undefined
    });
  }
  public query(d: { query: any; connection?: any }): Promise<[any, any]> {
    return new Promise((resolve: Function, reject: Function) => {
      const con = d.connection ? d.connection : this.connection;
      con.query(d.query, (err: any, rows: any, fields: any) => {
        if (err) {
          return reject(err);
        }
        return resolve([rows, fields]);
      });
    });
  }
}
