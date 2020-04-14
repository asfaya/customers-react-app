import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import AppFrame from '../components/AppFrame';
import CustomerEdit from '../components/CustomerEdit';
import { insertCustomer } from './../actions/insertCustomer';
import { SubmissionError } from 'redux-form';

class NewCustomerContainer extends Component {
    
    handleSubmit = (values) => {
        const { insertCustomer } = this.props;

        insertCustomer(values).catch(r => {
            throw new SubmissionError(r);
        });
    }

    handleSubmitSuccess = () => {
        this.props.history.goBack();
    }

    handleOnBack = () => {
        this.props.history.goBack();
    }

    renderBody = () => {
        const newCustomer = {
            "id": "",
            "dni": "",
            "name": "",
            "age": 0
        };

        return <CustomerEdit 
                    {...newCustomer}
                    onSubmit={ this.handleSubmit }
                    onSubmitSuccess={ this.handleSubmitSuccess }
                    onBack={ this.handleOnBack } />
    }

    render() {
        return (
            <div>
                <AppFrame
                    header={`Creación de un nuevo cliente`}
                    body={
                        this.renderBody()
                    }
                >

                </AppFrame>
            </div>
        );
    }
}

export default withRouter(connect(null, { insertCustomer })(NewCustomerContainer));