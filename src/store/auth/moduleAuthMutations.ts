const moduleAuthMutations = {
    AUTH_UPDATE_USER: (state: any, user: object) => {
        state.user = user;
    },
};

export default moduleAuthMutations;
