import React, { Component } from 'react';

class DisableOnClickWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisabled: this.props.initState,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.initState !== this.props.initState) {
            this.setState({ isDisabled: this.props.initState });
        }
    }

    handleElementClick = () => {
        // Отключаем все элементы, установив isDisabled в true
        this.setState({
            isDisabled: true,
        });
    };

    render() {
        const { children } = this.props;
        const { isDisabled } = this.state;

        if (isDisabled) return <></>;

        const childrenWithProps = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                    onClick: (event) => {
                        child.props.onClick(event);
                        this.handleElementClick();
                    }
                });
            }
            return child;
        });

        return <div>{childrenWithProps}</div>;
    }
}

export default DisableOnClickWrapper;
