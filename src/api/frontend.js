import service from '@/utils/request'

// 注册
export const register = (data) => {
    return service.post('/user/add', data)
};
// 开始咨询
export const startSession = (data) => {
    return service.post('/psychological-chat/session/start', data)
};
// 获取咨询会话
export const getSessionList = (params) => {
    return service.get('/psychological-chat/sessions', { params })
};
// 删除咨询会话
export const deleteSession = (sessionId) => {
    return service.delete(`/psychological-chat/sessions/${sessionId}`)
}
// 获取咨询会话消息
export const getSessionDetail = (sessionId) => {
    return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
// 获取咨询会话情感分析
export const getSessionEmotion = (sessionId) => {
    return service.get(`/psychological-chat/session/${sessionId}/emotion`)
}
// 提交情感日记
export const submitEmotionDiary = (data) => {
    return service.post('/emotion-diary', data)
}
// 获取知识库文章列表
export const getKnowledgeArticleList = (params) => {
    return service.get('/knowledge/article/page', { params })
}
// 获取知识库文章详情
export const getKnowledgeArticleDetail = (id) => {
    return service.get(`/knowledge/article/${id}`)
}
