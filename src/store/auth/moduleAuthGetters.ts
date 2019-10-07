const moduleAuthGetters = {
    isLoggedIn: (state: any) => !!state.user,
    getUser: (state: any) => state.user,
};

export default moduleAuthGetters;
