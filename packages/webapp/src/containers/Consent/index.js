import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { updateAgreement } from '../actions';
import ownerConsent from './Owner.Consent.md';
import workerConsent from './Worker.Consent.md';
import { useDispatch, useSelector } from 'react-redux';
import PureConsent from '../../components/Consent';
import history from '../../history';
import { userFarmSelector } from '../userFarmSlice';
import { patchConsent } from './saga';

function ConsentForm({ goBackTo = '/role_selection', goForwardTo = '/interested_in_organic' }) {
  const role = useSelector(userFarmSelector);
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, watch } = useForm();
  const [consentVersion] = useState('3.0');
  const [consent, setConsentText] = useState('');
  const hasConsent = watch('consentCheckbox', false);
  const checkBoxRef = register({
    required: {
      value: true,
      message: 'You must accept terms and conditions to use the app',
    },
  });
  const checkboxName = 'consentCheckbox';
  const goBack = () => {
    history.push(goBackTo);
  }

  const updateConsent = (data) => {
    dispatch(patchConsent({ has_consent: true, consent_version: consentVersion }));
  }

  useEffect(() => {
    let consentForm = role.role_id === 3 ? workerConsent : ownerConsent;
    fetch(consentForm)
      .then((r) => r.text())
      .then((text) => {
        setConsentText(text);
      })
  }, []);

  return (
    <PureConsent checkboxArgs={{
      inputRef: checkBoxRef,
      label: 'I Agree',
      name: checkboxName,
      errors: errors[checkboxName] && errors[checkboxName].message,
    }}
                 onSubmit={handleSubmit(updateConsent)}
                 onGoBack={goBack}
                 text={consent}
                 disabled={!hasConsent}
    >
    </PureConsent>
  )
}

export default ConsentForm;
