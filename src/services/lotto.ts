import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type LottoStatus = 'pending' | 'active' | 'completed';

export interface LottoEvent {
  id?: string;
  eventName: string;
  startDate: string;
  endDate: string;
  ticketPrice: number;
  currency: string;
  frequency: string;
  numbersToSelect: number;
  gridsPerTicket: number;
  createdAt?: string;
  status?: LottoStatus;
}

export interface LottoParticipation {
  id?: string;
  lottoId: string;
  userId: string;
  selectedNumbers: number[];
  purchaseDate: string;
  ticketPrice: number;
  currency: string;
}

const COLLECTION_NAME = 'lottos';
const PARTICIPATIONS_COLLECTION = 'lotto_participations';

export class LottoService {
  static async createLotto(data: Omit<LottoEvent, 'id' | 'createdAt' | 'status'>): Promise<string> {
    try {
      const now = new Date();
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      // Validation des dates
      if (startDate >= endDate) {
        throw new Error('La date de début doit être antérieure à la date de fin');
      }

      // Détermination du statut initial
      let initialStatus: LottoStatus = 'pending';
      if (now >= startDate && now < endDate) {
        initialStatus = 'active';
      } else if (now >= endDate) {
        initialStatus = 'completed';
      }

      const lottoData = {
        ...data,
        createdAt: now.toISOString(),
        status: initialStatus
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), lottoData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating lotto:', error);
      throw error instanceof Error ? error : new Error('Failed to create lotto event');
    }
  }

  static async getAllLottos(): Promise<LottoEvent[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const lottos: LottoEvent[] = [];
      
      querySnapshot.forEach((doc) => {
        lottos.push({
          id: doc.id,
          ...doc.data()
        } as LottoEvent);
      });

      // Mise à jour des statuts en fonction des dates actuelles
      const now = new Date();
      const updatedLottos = await Promise.all(lottos.map(async (lotto) => {
        const startDate = new Date(lotto.startDate);
        const endDate = new Date(lotto.endDate);
        let newStatus = lotto.status;

        if (now >= startDate && now < endDate && lotto.status === 'pending') {
          newStatus = 'active';
          await this.updateLottoStatus(lotto.id!, 'active');
        } else if (now >= endDate && lotto.status !== 'completed') {
          newStatus = 'completed';
          await this.updateLottoStatus(lotto.id!, 'completed');
        }

        return {
          ...lotto,
          status: newStatus
        };
      }));

      return updatedLottos;
    } catch (error) {
      console.error('Error fetching lottos:', error);
      throw new Error('Failed to fetch lotto events');
    }
  }

  static async getLotto(id: string): Promise<LottoEvent | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as LottoEvent;
    } catch (error) {
      console.error('Error fetching lotto:', error);
      throw new Error('Failed to fetch lotto event');
    }
  }

  static async updateLottoStatus(id: string, status: LottoStatus): Promise<void> {
    try {
      const lottoRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(lottoRef, { status });
    } catch (error) {
      console.error('Error updating lotto status:', error);
      throw new Error('Failed to update lotto status');
    }
  }

  static async deleteLotto(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Error deleting lotto:', error);
      throw new Error('Failed to delete lotto event');
    }
  }

  static async participate(data: Omit<LottoParticipation, 'id' | 'purchaseDate'>): Promise<string> {
    try {
      const lotto = await this.getLotto(data.lottoId);
      if (!lotto) {
        throw new Error('Lotto non trouvé');
      }

      const now = new Date();
      const startDate = new Date(lotto.startDate);
      const endDate = new Date(lotto.endDate);

      if (now < startDate) {
        throw new Error('Ce lotto n\'a pas encore commencé');
      }

      if (now >= endDate) {
        throw new Error('Ce lotto est terminé');
      }

      // Vérifier le nombre de numéros sélectionnés
      if (data.selectedNumbers.length !== lotto.numbersToSelect) {
        throw new Error(`Vous devez sélectionner exactement ${lotto.numbersToSelect} numéros`);
      }

      // Vérifier que les numéros sont uniques et dans la plage valide
      const uniqueNumbers = new Set(data.selectedNumbers);
      if (uniqueNumbers.size !== data.selectedNumbers.length) {
        throw new Error('Les numéros doivent être uniques');
      }

      if (data.selectedNumbers.some(n => n < 1 || n > 49)) {
        throw new Error('Les numéros doivent être entre 1 et 49');
      }

      const participationData = {
        ...data,
        purchaseDate: now.toISOString()
      };

      const docRef = await addDoc(collection(db, PARTICIPATIONS_COLLECTION), participationData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating participation:', error);
      throw error instanceof Error ? error : new Error('Failed to submit participation');
    }
  }

  static async getUserParticipations(userId: string): Promise<LottoParticipation[]> {
    try {
      const q = query(collection(db, PARTICIPATIONS_COLLECTION), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LottoParticipation));
    } catch (error) {
      console.error('Error fetching participations:', error);
      throw new Error('Failed to fetch participations');
    }
  }
}