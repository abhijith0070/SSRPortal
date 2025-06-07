'use client';
import Link from 'next/link';
import { useClipboard } from '@nextui-org/use-clipboard';
import toast from "react-hot-toast";
import { LocateIcon, MailOpenIcon } from 'lucide-react';

import InputField from '@/components/InputField';
import Button from '@/components/button';

const ContactPage = () => {
    
  const { copy, copied } = useClipboard();
    
  return (
      <div className="mx-auto container flex justify-center h-screen">
          <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
              <div className="max-w-2xl lg:max-w-5xl mx-auto">
                  <div className="text-center">
                      <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
                          Contact us
                      </h1>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">
                          We'd love to talk about how we can help you.
                      </p>
                  </div>

                  <div className="mt-12 grid items-center lg:grid-cols-2 gap-6 lg:gap-16">
                      <div className="flex flex-col border rounded-xl p-4 sm:p-6 lg:p-8 dark:border-gray-700">
                          <h2 className="mb-8 text-xl font-semibold text-gray-800 dark:text-gray-200">
                              Fill in the form
                          </h2>

                          <form>
                              <div className="grid gap-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div>
                                          <InputField label="First Name" name="firstname" required />
                                      </div>

                                      <div>
                                          <InputField label="Last Name" name="lastname" />
                                      </div>
                                  </div>
                                  <div>
                                      <InputField label="Email" name="email" type="email" required />
                                  </div>

                                  <div>
                                      <InputField label="Phone Number" name="phone" type="tel" />
                                  </div>

                                  <div>
                                      <InputField label="Details" name="details" type="textarea" rows={5} />
                                  </div>
                              </div>
                              <div className="mt-4 grid">
                                  <Button variant="primary" type="submit">
                                      Get in touch
                                  </Button>
                              </div>
                          </form>
                      </div>
                      <div className="divide-y divide-gray-200 dark:divide-gray-800">
                          <div className="flex gap-x-7 py-6">
                              <MailOpenIcon />
                              <div
                                  className="grow cursor-pointer"
                                  onClick={() => {
                                    copy('ssramritapuri@am.amrita.edu');
                                    toast.success('Email copied to clipboard!');
                                  }}
                              >
                                  <p className="mt-1 text-sm text-gray-500">Email</p>
                                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">ssramritapuri@am.amrita.edu</h3>
                                  <Link href="mailto:ssramritapuri@am.amrita.edu" onClick={(e) => e.stopPropagation()} className="mt-2 inline-flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                      Send us an email
                                      <svg className="flex-shrink-0 w-2.5 h-2.5 transition ease-in-out group-hover:translate-x-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M0.975821 6.92249C0.43689 6.92249 -3.50468e-07 7.34222 -3.27835e-07 7.85999C-3.05203e-07 8.37775 0.43689 8.79749 0.975821 8.79749L12.7694 8.79748L7.60447 13.7596C7.22339 14.1257 7.22339 14.7193 7.60447 15.0854C7.98555 15.4515 8.60341 15.4515 8.98449 15.0854L15.6427 8.68862C16.1191 8.23098 16.1191 7.48899 15.6427 7.03134L8.98449 0.634573C8.60341 0.268455 7.98555 0.268456 7.60447 0.634573C7.22339 1.00069 7.22339 1.59428 7.60447 1.9604L12.7694 6.92248L0.975821 6.92249Z" fill="currentColor" />
                                      </svg>
                                  </Link>
                              </div>
                          </div>
                          <div className="flex gap-x-7 py-6">
                              <LocateIcon />
                              <div className="grow">
                                  <p className="mt-1 text-sm text-gray-500">Address</p>
                                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                                      CIR, Amritapuri Campus,
                                      <br />
                                      Amrita Vishwa Vidyapeetham,
                                      <br />
                                      Clappana P.O., Kollam.
                                      <br />
                                      Kerala - 690525
                                  </h3>
                                  <div className="h-[300px] relative mt-6 border rounded-lg">
                                      <iframe
                                          width="100%"
                                          height="100%"
                                          className="absolute inset-0 shadow-xl"
                                          title="map"
                                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.668389986447!2d76.48924447600963!3d9.09394228796701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0602e7b4a2049d%3A0x3af3246b5138db0f!2sAmrita%20Vishwa%20Vidyapeetham%2C%20Amritapuri%20Campus!5e0!3m2!1sen!2sin!4v1705416874646!5m2!1sen!2sin"
                                      />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default ContactPage;