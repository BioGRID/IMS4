const moduleAuthMutations = {
    AUTH_UPDATE_USER: (state: any, user: object) => {
        state.user = user;
    },
    AUTH_UPDATE_USERS: (state: any, users: object) => {
        state.users = users;
    },
};

export default moduleAuthMutations;
