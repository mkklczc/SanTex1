import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { publicProcedure, router } from '../../lib/trpc'
import { UserRole } from '../../types/roles'

const ADMIN_ROLE_ID = 'fcc58743-40fa-471a-8fce-8e684b76ab7f'
const PROJECT_MANAGER_ROLE_ID = '5cea8cbf-eb80-4caa-988c-a73642ca24e2'
const WAREHOUSE_MANAGER_ROLE_ID = '823c92fc-f9d5-4424-bd92-f50096af541d'
const TECHNICIAN_ROLE_ID = 'bfbda67d-490a-4f08-b9e4-a762fc95c353'

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
