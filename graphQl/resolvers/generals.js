import client from "../db/index.js"

export const resolver = {
  Query: {
    users: async () => {
      const data = await client.query("select * from users")
      return data.rows
    },
    user: async (_, args) => {
      const data = await client.query("select * from users where id = $1", [args.id])
      return data.rows[0]
    },
    categories: async () => {
      const data = await client.query("select * from categories")
      return data.rows
    },
    category: async (_, args) => {
      const data = await client.query("select * from category where id = $1", [args.id])
      return data.rows[0]
    },
    products: async () => {
      const data = await client.query("select * from products")
      return data.rows
    },
    product: async (_, args) => {
      const data = await client.query("select * from product where id = $1", [args.id])
      return data.rows[0]
    },
    orders: async () => {
      const data = await client.query("select * from orders")
      return data.rows
    },
    order: async (_, args) => {
      const data = await client.query("select * from order where id = $1", [args.id])
      return data.rows[0]
    },

    reviews: async () => {
      const data = await client.query("select * from reviews")
      return data.rows
    },
    reviews: async (_, args) => {
      const data = await client.query("select * from review where id = $1", [args.id])
      return data.rows[0]
    },
  },
  User: {
    orders: async (parent, args) => {
      const conditions = ["user_id = $1"]
      const params = [parent.id]

      if (args.payment_status) {
        params.push(args.payment_status)
        conditions.push(`payment_status = $${params.length}`)
      }

      if (args.total_amount) {
        params.push(args.total_amount)
        conditions.push(`total_amount < $${params.length}`)
      }

      const data = await client.query(
        `select * from orders where ${conditions.join(" and ")}`,
        params
      )
      return data.rows
    },
    reviews: async (parent) => {
      const params = [parent.id]
      const conditions = ["user_id = $1"]
      const data = await client.query(`select * from reviews where ${conditions.join(" and ")}`, params)
      return data.rows
    }
  }
}
