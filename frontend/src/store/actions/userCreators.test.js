import axios from 'axios';
import {store} from '../store'
import * as userCreators from './userCreators'

const stubCurrentUser = {"id": 1, "email": "edsger@dijkstra.com", "password": "iluvswpp",
"name": "Edsger Dijkstra", "logged_in": true}
const stubUserList= [{"id": 1, "email": "edsger@dijkstra.com", "password": "iluvswpp",
"name": "Edsger Dijkstra", "logged_in": true}]

describe('userCreators', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should get a single user', async () => {
        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: stubCurrentUser
                }
            })
        })
        await store.dispatch(userCreators.getUser());
        expect(axios.get).toHaveBeenCalledTimes(1)
    })
})