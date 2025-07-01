import Database from "better-sqlite3";
export interface DatabaseConfig {
    path: string;
    options?: Database.Options;
}
export declare const getDatabase: () => Database.Database;
export declare const initializeDatabase: () => Promise<Database.Database>;
export declare const createTables: () => Promise<void>;
export declare const closeDatabase: () => void;
//# sourceMappingURL=connection.d.ts.map