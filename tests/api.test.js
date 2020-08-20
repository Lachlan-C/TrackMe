const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();
const {
    API_URL
} = process.env;

test('test device array', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices`).then(resp => resp.data).then(resp => {
        expect(resp[0].user).toEqual('sam');
    });
});

test('test api', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/test`).then(resp => resp.data).then(resp => {
        expect(resp).toEqual('The API is working!');
    });
});

test('test array find another user', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices`).then(resp => resp.data).then(resp => {
        expect(resp[2].user).toEqual('alex');
    });
});
test('get user id', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices`).then(resp => resp.data).then(resp => {
        expect(resp[3].id).toEqual('1');
    });
});
test('test device name', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices`).then(resp => resp.data).then(resp => {
        expect(resp[9].name).toEqual('android 2');
    });
});