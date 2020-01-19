const moduleAuthGetters = {
    isLoggedIn: (state: any) => !!state.user,
    getUser: (state: any) => state.user,
    getUserClass: (state: any) => state.user.class,
    getUsers: (state: any) => state.users,
    getUserDetails: (state: any) => (userID: string) => {
        return state.users[userID];
    },
    getPermission: (state: any) => (permissionName: string) => {
        return state.permissions[permissionName];
    },
};

export default moduleAuthGetters;
