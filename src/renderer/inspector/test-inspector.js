Vue.component("driver-dict", {
    template: `
        <h2> Driver-dict </h2>
        <h2> title: {{target}} </h2>

        <ui-prop name="driver" indent="1">
            <ui-prop name="key"> </ui-prop>
            <ui-prop name="value"> </ui-prop>
        </ui-prop>
    `,

    props: {
        target: {}
    }
});

Vue.component("test-inspector", {
    template: `
        <h1> {{ target.bar.value }} </h1>
        <driver-dict :target="target.foo" />
    `,

    props: {
        target: {
            twoWay: true,
            type: Object
        }
    }
});