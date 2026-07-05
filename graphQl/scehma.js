export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    first_name: String!
    last_name: String!
    phone: String
    address: String
    city: String
    country: String
    role: String
    created_at: String
    updated_at: String
    orders(payment_status: String , total_amount : Float ): [Order]
    reviews: [Review]
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    parent: Category
    subcategories: [Category]
    products: [Product]
    created_at: String
  }

  type Product {
    id: ID!
    name: String!
    slug: String!
    description: String
    price: Float!
    compare_price: Float
    sku: String!
    stock: Int!
    category: Category
    seller: User
    is_active: Boolean
    weight_kg: Float
    created_at: String
    updated_at: String
    reviews: [Review]
  }

  type Order {
    id: ID!
    user: User!
    status: String
    total_amount: Float!
    shipping_address: String!
    shipping_city: String!
    shipping_country: String!
    payment_method: String!
    payment_status: String
    tracking_number: String
    notes: String
    created_at: String
    updated_at: String
    items: [OrderItem]
  }

  type OrderItem {
    id: ID!
    order: Order!
    product: Product!
    quantity: Int!
    unit_price: Float!
    total_price: Float
  }

  type Review {
    id: ID!
    user: User!
    product: Product!
    rating: Int!
    title: String
    body: String
    is_verified: Boolean
    created_at: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
    categories: [Category]
    category(id: ID!): Category
    products: [Product]
    product(id: ID!): Product
    orders: [Order]
    order(id: ID!): Order
    reviews: [Review]
    review(id: ID!): Review
  }
`
