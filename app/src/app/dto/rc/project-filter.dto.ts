/**
 * ProjectFilter interface that maps to the backend ProjectFilterDTO
 * @see Backend: com.alten.remotesync.application.project.record.request.ProjectFilterDTO
 */
export interface ProjectFilter {
    filter?: 'projectLabel' | 'clientLabel' | "",
    value?: string,
    sort: 'label' | 'titre' | 'client' | 'status'
    sortType: 1 | -1,
    pageNumber: number,
    pageSize: number,

}