import React from 'react';
import { login } from '../../modules/user';

const AuthModal = () => {
    return (
        <div className="modal fade" id="authModal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h6 className="modal-title">Log in with your Twitter account</h6>
                    </div>
                    <div className="modal-body text-center">
                        <button className="btn btn-primary font-weight-bold w-50" onClick={login}>Log in</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
