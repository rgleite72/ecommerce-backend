
export interface IRefreshStore {

  save(userId: string, jti: string, expEpochSec: number): Promise<void>;

 
  isActive(userId: string, jti: string): Promise<boolean>;


  revoke(userId: string, jti: string): Promise<void>;


  revokeAll(userId: string): Promise<void>;
}
