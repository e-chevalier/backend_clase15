import { dataProducts as products } from '../../config/mockups_data.js'
import { db_firestore } from './firestore.js'


const uploadToFirestore = () => {

    const db_collectionProducts = db_firestore.collection('products')

    products.forEach( prod => db_collectionProducts
        .add(prod)
        .then(data => console.log(data.id))
        .catch(err => console.log(err))
        .finally()
    )

}

export default uploadToFirestore