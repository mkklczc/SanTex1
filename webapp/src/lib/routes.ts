const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {}) as Record<keyof T, string>
}

export const getAllTicketsRoute = () => '/'

export const viewTicketRouteParams = getRouteParams({ ticketId: true })
export type ViewTicketsRouteParams = typeof viewTicketRouteParams
export const getViewTicketRoute = ({ ticketId }: ViewTicketsRouteParams) => `/tickets/${ticketId}`

export const getAllAppRoute = () => '/'

export const allMaterialsRouteParams = getRouteParams({ sanTex: true })
export type AllMaterialsRouteParams = typeof allMaterialsRouteParams
export const getAllMaterialsRoute = ({ sanTex }: AllMaterialsRouteParams) => `/resources/${sanTex}`

export const getNewMaterialsRoute = () => '/resource/materials/newmaterials'
export const getEditMaterialRoute = ({ materialId }: { materialId: string }) => `/resource/materials/${materialId}/edit`
export const getNewEquipmentRoute = () => '/resource/equipment/newequipment'
export const getNewWorkRoute = () => '/works/newwork'
export const getNewObjectRoute = () => '/objects/newobject'
export const getNewReportRoute = () => '/reports/newreport'

export const getEquipmentRoute = () => '/resource/equipment'
export const getWorksRoute = () => '/works'
export const getObjectsRoute = () => '/objects'
export const getReportsRoute = () => '/reports'
export const getSettingsRoute = () => '/settings'
// export const allMaterialsRouteParams = { sanTex: ':sanTex' }
// export type AllMaterialsRouteParams = { sanTex: string }
// export const getAllMaterialsRoute = ({ sanTex }: { sanTex: string }) => `/resources/${sanTex}`
