import { Component } from "react";
import { a, hh, div, button, span, ul, li, b, form, input } from 'react-hyperscript-helpers';
import { InputFieldText } from './InputFieldText';
import { Btn } from '../components/Btn';

export const TopNavigationMenu = hh(class TopNavigationMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageCounter : 0,
        }
    }

    render(){
        return(
            div({className: "navbar navbar-default navbar-fixed-top", role: "navigation"}, [
                div({className: "container"}, [
                    div({className: "navbar-header"}, [
                        button({className: "navbar-toggle", type: "button"}, [
                            span({className: "sr-only"}, ["Toggle navigation"]),
                            span({className: "icon-bar"}, []),
                            span({className: "icon-bar"}, []),
                            span({className: "icon-bar"}, [])
                        ]),
                        a({
                            className: "navbar-brand", 
                            href: "/"
                        }, [
                            span({isRendered: true}, [
                                "ORSP Portal ", span({className: "label label-danger"}, ["Dev"])
                            ]),
                            span({isRendered: false}, ["ORSP Portal"])
                        ])
                    ]),
                    div({className: "navbar-collapse collapse"}, [
                        ul({className: "nav navbar-nav"}, [
                            li({}, [
                                a({href: "/"}, ["About"])
                            ]),
                            li({}, [
                                a({href: "/"}, ["Search"])
                            ]),
                            li({className: "dropdown"}, [
                                a({className: "dropdown-toggle", href: "/"}, [
                                    "New ", b({className: "caret"}, [])
                                ]),
                                ul({className: "dropdown-menu"}, [
                                    li({}, [a({}, ["New Project"])])
                                ])
                            ]),
                            li({isRendered: true, className: "dropdown"}, [
                                a({className: "dropdown-toggle", href: "/"}, [
                                    "Admin ", b({className: "caret"}, [])
                                ]),
                                ul({className: "dropdown-menu"}, [
                                    li({}, [a({href: "/"}, ["Data Use Restrictions"])]),
                                    li({}, [a({href: "/"}, ["Review Category Report"])]),
                                    li({}, [a({href: "/"}, ["Event Report"])]),
                                    li({}, [a({href: "/"}, ["Funding Source Report"])]),
                                    li({}, [a({href: "/"}, ["AAHRPP Metrics Report (CSV)"])]),
                                    li({}, [a({href: "/"}, ["Roles Management"])])
                                ])
                            ])
                        ]),
                        form({className: "navbar-form navbar-left"}, [
                            div({className: "form-group"}, [
                                input({
                                    className: "form-control",
                                    id: this.props.id,
                                    type: 'text',
                                    disabled: false,
                                    onChange: this.props.onChange,
                                    placeholder: "ORSP ID #"
                                  })
                            ])
                        ]),
                        ul({className: "nav navbar-nav"}, [
                            li({},[
                                a({href: "/"}, ["Jaime Bernales"])
                            ]),
                            li({},[
                                a({href: "#"}, ["Sign out"])
                            ])
                        ])
                    ])
                ])
            ])
        )
    }
});

export default TopNavigationMenu;
