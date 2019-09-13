const actions = {
    // Allow for the collapsing and maximizing of the NavDrawer
    toggleNavDrawerMinimization: (context: any) => {
        context.commit('toggleNavDrawerMinimization');
    },
};

export default actions;
