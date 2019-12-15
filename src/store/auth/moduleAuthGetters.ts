const moduleAuthGetters = {
    isLoggedIn: (state: any) => !!state.user,
    getUser: (state: any) => state.user,
    getUsers: (state: any) => state.users,
    getUserDetails: (state: any) => (userID: string) => {
        return state.users[userID];
    },
};

export default moduleAuthGetters;
