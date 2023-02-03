import { faker } from '@faker-js/faker';
import { useCallback, useEffect } from 'react';
import { new_card } from 'src/lib/generate_card.js';
import { useLocalStorage } from 'usehooks-ts';
import useEmail from './useEmail';
import useSettings from './useSettings';

const useIdentity = (): {
  identity: Record<string, any>;
  newIdentity: () => void;
} => {
  const { email, otp, getNewEmail } = useEmail();
  const [identity, setIdentity] = useLocalStorage<Record<string, any>>(
    'throwaway-identity',
    {}
  );
  const { useAlternateProvider } = useSettings();

  const newIdentity = useCallback(() => {
    const cvc = `${Math.floor(Math.random() * 899) + 100}`;
    const card_expiry_month = `0${Math.floor(Math.random() * 8) + 1}`;
    const card_expiry_year = `${Math.floor(Math.random() * 7) + 22}`;
    const card_expiry = `${card_expiry_month}/${card_expiry_year}`;
    getNewEmail();
    const card_number = new_card();
    const generatedIdentity = {
      email,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      avatar: `https://api.lorem.space/image?w=500&h=500&x=${
        Math.floor(Math.random() * 899) + 100
      }`,
      card_number,
      'cc-number': card_number,
      cardNumber: card_number,
      card_expiry,
      'cc-exp': card_expiry,
      expMonth: card_expiry_month,
      expYear: card_expiry_year,
      MM: card_expiry_month,
      YY: card_expiry_year,
      cvc,
      card_verification: cvc,
      'cc-csc': cvc,
      job_title: faker.name.jobTitle(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      state: faker.address.state(),
      city: faker.address.city(),
      street_address: faker.address.streetAddress(),
      street: faker.address.streetAddress(),
      zipcode: faker.address.zipCode(),
      phone: faker.phone.number(),
      country: faker.address.country(),
      company: faker.company.name(),
      organization: faker.company.name(),
      username: faker.internet.userName(),
      password: faker.internet.password() + faker.internet.password(),
      suite: faker.address.secondaryAddress(),
      apartment: faker.address.secondaryAddress(),
      dateofbirth: faker.date.past(50).toISOString().split('T')[0],
      date: faker.date.past(50).toISOString().split('T')[0],
      otp,
      code: otp,
      verification_code: otp,
    };
    setIdentity(generatedIdentity);
  }, [otp]);

  useEffect(() => {
    if (!identity.name) {
      newIdentity();
    } else {
      setIdentity({ ...identity, email });
    }
  }, [email, otp]);

  useEffect(() => {
    chrome.storage.local.set({
      identity: JSON.stringify(identity),
      throwaway_env: JSON.stringify({
        VITE_API_URL: import.meta.env.VITE_API_URL,
        useAlternateProvider,
      }),
    });
  }, [identity, email, otp]);

  return {
    identity,
    newIdentity,
  };
};

export default useIdentity;
