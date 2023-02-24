import { RHS_URL } from '../constants';
import { ExtensionService } from './Extension.service';
const  { core } = window.PolygonIdSdk;
export class IdentityServices {
	static instanceIS;
	static async createIdentity() {
		if(!this.instanceIS) {
			const { wallet } = ExtensionService.getExtensionServiceInstance();
			const seedPhrase = new TextEncoder().encode('seedseedseedseedseedseedseedseed');
			return  await wallet.createIdentity(
				'http://polygonID.com/',
				{
					method: core.DidMethod.Iden3,
					blockchain: core.Blockchain.Polygon,
					networkId: core.NetworkId.Mumbai,
					seed: seedPhrase,
					rhsUrl: RHS_URL
				}
			);
		} else
			return this.instanceIS;
	}
	
	static getIdentityInstance(){
		return this.instanceIS;
	}
}