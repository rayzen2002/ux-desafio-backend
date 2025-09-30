import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

class DrizzleHealthCheck {
  private maxRetries: number;
  private retryDelay: number;

  constructor(maxRetries = 30, retryDelay = 2000) {
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }

  async waitForDatabase(config: DatabaseConfig): Promise<boolean> {
    console.log('Aguardando banco de dados ficar disponível...');

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      let pool: Pool | null = null;
      
      try {
        console.log(`Tentativa ${attempt} de ${this.maxRetries}`);
        pool = new Pool({
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
          connectionTimeoutMillis: 5000,
        });

        const db = drizzle(pool);

        const result = await db.execute(sql`SELECT 1 as connection_test`);
        
        console.log('✅ Banco de dados está pronto e aceitando operações!');
        await pool.end();
        return true;

      } catch (error: any) {
        console.log(`❌ Tentativa ${attempt} falhou: ${error.message}`);
        
    
        if (pool) {
          try {
            await pool.end();
          } catch (e) {
          
          }
        }
        
        if (attempt === this.maxRetries) {
          console.error('❌ Número máximo de tentativas atingido. Banco de dados não está disponível.');
          throw new Error(`Database not ready after ${this.maxRetries} attempts`);
        }
        
        console.log(`⏳ Aguardando ${this.retryDelay}ms antes da próxima tentativa...`);
        await this.delay(this.retryDelay);
      }
    }

    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
async function main() {
  const healthCheck = new DrizzleHealthCheck(30, 2000);
  
  const dbConfig: DatabaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'nestdb',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  };

  try {
    await healthCheck.waitForDatabase(dbConfig);
    console.log('🟢 Aplicação pode iniciar!');
  } catch (error) {
    console.error('❌ Falha ao conectar com o banco de dados:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { DrizzleHealthCheck };