import axios from 'axios';
import store from '../store'
import * as replyCreators from './reply'

const stubCurrentUser = {"id": 1, "email": "edsger@dijkstra.com", "password": "iluvswpp",
"name": "Edsger Dijkstra", "logged_in": true}
const stubUserList= [{"id": 1, "email": "edsger@dijkstra.com", "password": "iluvswpp",
"name": "Edsger Dijkstra", "logged_in": true}]

describe('reply', () => {
    const fflushPromises = () => {
        return new Promise(resolve => setImmediate(resolve));
    }
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should get list of reply', async () => {
        axios.get = jest.fn(() => {
            return new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: stubUserList
                }
                resolve(result)
            })
        })
        await store.dispatch(replyCreators.getReplies(1));
        expect(axios.get).toHaveBeenCalledTimes(1)
    })

    it('should get reply set', async () => {
        axios.get = jest.fn(() => {
            return new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: stubUserList
                }
                resolve(result)
            })
        })
        await store.dispatch(replyCreators.getReplySet([0, 1, 2]));
        expect(axios.get).toHaveBeenCalledTimes(3)
    })

    it('should add reply', async () => {
        axios.post = jest.fn(() => {
            return new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: stubCurrentUser
                }
                resolve(result);
            })
        })
        await store.dispatch(replyCreators.addReply({'commentId': 1}));
        expect(axios.post).toHaveBeenCalledTimes(1);
    })
    
    it('should edit reply', () => {
        axios.put = jest.fn(() => {
            return new Promise((resolve) => {
                const result = {
                    status: 200,
                    data: {id: 1}
                }
                resolve(result);
            })
        })
        store.dispatch(replyCreators.editReply({id:1}));
        expect(axios.put).toHaveBeenCalledTimes(1);
    })
    
    
    it('should delete reply', () => {
        axios.delete = jest.fn(() => {
            return new Promise((resolve) => {
                const result = {
                    status: 200,
                }
                resolve(result);
            })
        })
        store.dispatch(replyCreators.deleteReply(1));
        expect(axios.delete).toHaveBeenCalledTimes(1);
    })
    
})