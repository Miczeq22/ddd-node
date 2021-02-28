export interface DatabaseTransaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
