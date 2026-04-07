const pool = require('./db');

const initDB = async () => {
    try {
        console.log('Initializing Database Schema...');

        await pool.query('DROP TABLE IF EXISTS transactions CASCADE;');
        await pool.query('DROP TABLE IF EXISTS wallet_members CASCADE;');
        await pool.query('DROP TABLE IF EXISTS wallets CASCADE;');
        await pool.query('DROP TABLE IF EXISTS users CASCADE;');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ users table created or verified.');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS wallets (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                type VARCHAR(20) CHECK (type IN ('personal', 'shared')) NOT NULL,
                created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ wallets table created or verified.');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS wallet_members (
                wallet_id INTEGER REFERENCES wallets(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY(wallet_id, user_id)
            );
        `);
        console.log('✅ wallet_members table created or verified.');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                wallet_id INTEGER REFERENCES wallets(id) ON DELETE CASCADE,
                paid_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
                amount DECIMAL(10, 2) NOT NULL,
                type VARCHAR(20) CHECK (type IN ('income', 'expense', 'transfer')) NOT NULL,
                category VARCHAR(50),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ transactions table created or verified.');

        console.log('Database Initialization complete.');
        process.exit(0);

    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
};

initDB();
