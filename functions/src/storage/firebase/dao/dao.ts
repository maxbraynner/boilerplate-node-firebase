import * as Boom from 'boom';
import * as admin from "firebase-admin";

export abstract class DAO {

    constructor(private collection: string) { }

    /**
     * 
     * @param id 
     */
    async findById(id: string) {
        const collectionRef = this.ref();
        const ref = await collectionRef.doc(id).get();

        if (!ref.exists) {
            throw Boom.notFound(`Doc ${id} not found`);
        }

        const data = { ...ref.data(), id: ref.id };
        return data;
    }

    /**
     * 
     * @param atribute 
     * @param value 
     */
    async findBy(atribute: string, value: string) {
        const ref = this.ref();

        const snapshot = await ref.where(atribute, '==', value).get();

        const data = snapshot.docs.map(f => {
            return { ...f.data(), id: f.id };
        });

        return data;
    }

    find(id: string[]);
    find(...id: string[]);

    /**
     * Find one or many IDs
     */
    async find(id: any) {
        let data;
        if (typeof id === 'string') {
            data = await this.findById(id)
            return data;
        }

        const promisses = id.map(i => this.findById(i));
        data = await Promise.all(promisses);

        return data;
    }

    ref() {
        const db = admin.firestore();

        return db.collection(this.collection);
    }
}