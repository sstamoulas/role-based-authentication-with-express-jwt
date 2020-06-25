import faker from 'faker'
import User from './models/user.model'
import Product from './models/product.model'
import roles from './helpers/roles'

export const seed = async () => {
  seedUsers().then((users) => {
    seedProducts().then((products) => {
    })
  })
}

// create array of fake users then seed database
const seedUsers = async () => {
  try {

    // check if already populated
    const usersCollection = await User.find()
    if (usersCollection.length > 1) {
      return
    }

    // number of users to generate
    const quantity = 10
    let users = []

    for (let i = 0; i < quantity; i++) {
      let randomNum = Math.floor(Math.random() * 2)
      let password = faker.internet.password()
      let username = faker.internet.userName()

      users.push(
        new User({
          username: username,
          password: password,
          name: faker.name.firstName(),
          lastname: faker.name.lastName(),
          age: faker.random.number({
              min: 18,
              max: 65
          }),
          role: roles[randomNum]
        })
      )
    }

    // create new database entry for every user in the array
    users.forEach(user => {
      User.create(user)
    })

    console.log('Users Collection has been Populated!')
    return Promise.resolve(users)
  } catch (error) {
    console.log('Error: ', error)
  }
}

// create array of fake products then seed database
const seedProducts = async () => {
  try {

    // check if already populated
    const productsCollection = await Product.find()
    if (productsCollection.length > 1) {
      return
    }

    // number of products to generate
    const quantity = 10
    // list of userIds to assign to a product created_by field
    const userIds = await User.find({role: 'admin'}).select('_id')
    let products = []

    for (let i = 0; i < quantity; i++) {
      let randomNum = Math.floor(Math.random() * userIds.length)

      products.push(
        new Product({
          name: faker.commerce.productName(),
          price: faker.commerce.price(),
          description: faker.lorem.sentence(),
          created_by: userIds[randomNum]._id
        })
      )
    }

    // create new database entry for every product in the array
    products.forEach(product => {
      Product.create(product)
    })

    console.log('Products Collection has been Populated!')
    return Promise.resolve(products)
  } catch (error) {
    console.log('There was an error', error)
  }
}
