import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AppFrame from '../components/AppFrame';
import { getCustomerByDni } from './../selectors/customers';
import CustomerEdit from './../components/CustomerEdit';
import CustomerData from './../components/CustomerData';
import { fetchCustomers } from './../actions/fetchCustomers';
import { updateCustomer } from './../actions/updateCustomer';
import { deleteCustomer } from './../actions/deleteCustomer';
import { SubmissionError } from 'redux-form';

class CustomerContainer extends Component {

    componentDidMount() {
        const { customer, fetchCustomers } = this.props;

        if(!customer) {
            fetchCustomers();
        }
    }

    handleSubmit = values => {
        const { updateCustomer } = this.props;
        const { id } = values;

       return updateCustomer(id, values).catch(r => {
            throw new SubmissionError(r);
        });
    }

    handleOnSubmitSuccess = () => {
        this.props.history.goBack();
    }

    handleOnBack = () => {
        this.props.history.goBack();
    }

    handleOnDelete = id => {
        const { deleteCustomer } = this.props;

        deleteCustomer(id)
            .then(v => {
                this.props.history.goBack();
            });
    }

    renderCustomerControl = (isEdit, isDelete) => {
        if (this.props.customer) {
            const CustomerControl = isEdit ? CustomerEdit : CustomerData;
            return (<CustomerControl { ...this.props.customer } 
                        onSubmit={this.handleSubmit}
                        onSubmitSuccess={this.handleOnSubmitSuccess}
                        onDelete={this.handleOnDelete}
                        onBack={this.handleOnBack}
                        isDeleteAllowed={!!isDelete} />);
        }

        return null;
    }

    renderBody = () => (
        <Route path="/customers/:dni/edit" children={
            ( { match: isEdit } ) => (
                <Route path="/customers/:dni/delete" children={
                        ( {match: isDelete} ) => (
                            this.renderCustomerControl(isEdit, isDelete)
                        )}
                /> )   
            }
        />
    )

    render() {
        const { dni } = this.props;
        return (
            <div>
                <AppFrame
                    header={`Cliente ${ dni }`}
                    body={ this.renderBody() }>
                </AppFrame>
            </div>
        );
    }
}

CustomerContainer.propTypes = {
    dni: PropTypes.string.isRequired,
    customer: PropTypes.object,
    fetchCustomers: PropTypes.func.isRequired,
    updateCustomer: PropTypes.func.isRequired,
    deleteCustomer: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
    customer: getCustomerByDni(state, props)
});

export default withRouter(connect(mapStateToProps, {
    fetchCustomers,
    updateCustomer,
    deleteCustomer
})(CustomerContainer));