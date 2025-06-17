import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { publicProcedure, router } from '../../lib/trpc'
import { UserRole } from '../../types/roles'

const ADMIN_ROLE_ID = '30bf7ea6-9efd-4ac1-8996-d3a153a91551'
const PROJECT_MANAGER_ROLE_ID = '880dc2af-1865-499d-9b78-9431ba7370b2'
const WAREHOUSE_MANAGER_ROLE_ID = '5fc44f44-e58c-4ebc-ab79-7383f2ffdf18'
const TECHNICIAN_ROLE_ID = '69cccdb8-3c7c-426e-8953-713194d16b3b'

export const authTrpcRoute = router({
  login: publicProcedure
    .input(
      z.object({
        login: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { login: input.login },
        include: {
          role: true,
        },
      })

      if (!user || !(await bcrypt.compare(input.password, user.password_hash))) {
        throw new Error('Неверный логин или пароль')
      }

      // Инициализация роли по умолчанию
      let role: UserRole = 'user'

      const roleId = user.role.id

      if (roleId === ADMIN_ROLE_ID) {
        role = 'admin'
      } else if (roleId === PROJECT_MANAGER_ROLE_ID) {
        role = 'project_manager'
      } else if (roleId === WAREHOUSE_MANAGER_ROLE_ID) {
        role = 'warehouse_manager'
      } else if (roleId === TECHNICIAN_ROLE_ID) {
        role = 'technician'
      }

      const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET!, {
        expiresIn: '1d',
      })

      return {
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          role,
        },
      }
    }),
})
