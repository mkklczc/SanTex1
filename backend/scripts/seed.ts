import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const password_hash = await bcrypt.hash('123', 10)

  // Получаем роль, которую нужно присвоить пользователю, например, роль 'user'
  const role = await prisma.role.findFirst({
    where: { name: 'user' }, // Можно изменить на нужную роль
  })

  if (!role) {
    console.info('Роль не найдена')
    return
  }

  await prisma.user.create({
    data: {
      full_name: 'Антон Малышев',
      login: 'malyshev',
      email: 'malyshev@example.com',
      password_hash,
      roleId: role.id, // Присваиваем roleId пользователю
    },
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
