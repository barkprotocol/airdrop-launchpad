import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function querySubscriptions() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      take: 10, // Limit to 10 results for this example
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('Recent Subscriptions:')
    subscriptions.forEach((sub: { email: any; createdAt: any }, index: number) => {
      console.log(`${index + 1}. Email: ${sub.email}, Created At: ${sub.createdAt}`)
    })

    console.log(`\nTotal Subscriptions: ${await prisma.subscription.count()}`)
  } catch (error) {
    console.error('Error querying subscriptions:', error)
  } finally {
    await prisma.$disconnect()
  }
}

querySubscriptions()

