import Link from 'next/link';

import Logo from '@/components/Logo';
import { Card } from '@/components/ui/card';


const PortalPage = () => {
  // Mocked data for demonstration
  const data = {
    isLoggedIn: false,
    showProposalSubmission: false,
    showProjectSubmission: true,
  };

  return (
      <div className="min-h-screen w-screen bg-gray-50">
          <header className="fixed top-4 left-4 flex items-center gap-2 w-max">
              <Logo />
          </header>

          <main className="grid md:grid-cols-2 gap-8 px-8 py-16 h-full min-h-screen">
              <div className="space-y-6 flex items-center justify-center border-r">
                  <section>
                      <h2 className="text-2xl text-center text-gray-800 opacity-60 mb-6">Students Corner</h2>
                      {/* <div className="flex gap-4">
                          {data.showProposalSubmission && (
                              <Link href="/proposal-submission" prefetch={false}>
                                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer rounded">
                                      <h3 className="text-xl font-semibold text-primary">Proposal Submission</h3>
                                      <p className="text-gray-500">Submit your project proposal for approval.</p>
                                  </Card>
                              </Link>
                          )}
                          {data.showProjectSubmission && (
                              <Link href="/project-submission" prefetch={false}>
                                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer rounded">
                                      <h3 className="text-xl font-semibold text-primary">Project Submission</h3>
                                      <p className="text-gray-500">Upload and share your completed project.</p>
                                  </Card>
                              </Link>
                          )}
                          {!data.showProposalSubmission && !data.showProjectSubmission && (
                              <Card className="p-6 bg-red-50">
                                  <h3 className="text-lg font-semibold text-red-600">Submissions Closed</h3>
                                  <p className="text-gray-500">Submissions are currently not available. Please contact your mentor for further assistance.</p>
                              </Card>
                          )}
                      </div> */}
                      <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                        <Link href="/auth/student/signin" prefetch={false}>
                            <Card className="p-8 hover:shadow-lg transition-all hover:scale-105 cursor-pointer rounded-xl border-2 border-primary/20">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    <h3 className="text-2xl font-semibold text-primary">Sign In</h3>
                                    <p className="text-gray-600">Already have an account? Sign in to access your submissions</p>
                                </div>
                            </Card>
                        </Link>
                        
                        <Link href="/auth/signup" prefetch={false}>
                            <Card className="p-8 hover:shadow-lg transition-all hover:scale-105 cursor-pointer rounded-xl border-2 border-primary/20">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    <h3 className="text-2xl font-semibold text-primary">Sign Up</h3>
                                    <p className="text-gray-600">New to SSRConnect? Create your student account here</p>
                                </div>
                            </Card>
                        </Link>
                    </div>
                  </section>
              </div>

              {/* Right Section */}
              <div className="space-y-6 justify-center items-center flex">
                  {/* <section>
                      <h2 className="text-2xl text-center text-gray-800 opacity-60 mb-6">Mentors Corner</h2>
                      <div className="flex gap-4">
                          {data.isLoggedIn ? (
                              <Link href="/dashboard" prefetch={false}>
                                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer rounded">
                                      <h3 className="text-xl font-semibold text-primary">Dashboard</h3>
                                      <p className="text-gray-500">View and manage project submissions by students.</p>
                                  </Card>
                              </Link>
                          ) : (
                              <Link href="/auth/signin" prefetch={false}>
                                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer rounded">
                                      <h3 className="text-lg font-semibold text-primary">Login</h3>
                                      <p className="text-gray-500">Please login to access the mentor's corner.</p>
                                  </Card>
                              </Link>
                          )}
                      </div>
                  </section> */}
                   <section>
                      <h2 className="text-2xl text-center text-gray-800 opacity-60 mb-6">Mentors Corner</h2>
                      {/* <div className="flex gap-4">
                          {data.showProposalSubmission && (
                              <Link href="/proposal-submission" prefetch={false}>
                                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer rounded">
                                      <h3 className="text-xl font-semibold text-primary">Proposal Submission</h3>
                                      <p className="text-gray-500">Submit your project proposal for approval.</p>
                                  </Card>
                              </Link>
                          )}
                          {data.showProjectSubmission && (
                              <Link href="/project-submission" prefetch={false}>
                                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer rounded">
                                      <h3 className="text-xl font-semibold text-primary">Project Submission</h3>
                                      <p className="text-gray-500">Upload and share your completed project.</p>
                                  </Card>
                              </Link>
                          )}
                          {!data.showProposalSubmission && !data.showProjectSubmission && (
                              <Card className="p-6 bg-red-50">
                                  <h3 className="text-lg font-semibold text-red-600">Submissions Closed</h3>
                                  <p className="text-gray-500">Submissions are currently not available. Please contact your mentor for further assistance.</p>
                              </Card>
                          )}
                      </div> */}
                      <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                        <Link href="/auth/signin" prefetch={false}>
                            <Card className="p-8 hover:shadow-lg transition-all hover:scale-105 cursor-pointer rounded-xl border-2 border-primary/20">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    <h3 className="text-2xl font-semibold text-primary">Sign In</h3>
                                    <p className="text-gray-600">Already have an account? Sign in to access your submissions</p>
                                </div>
                            </Card>
                        </Link>
                        
                        <Link href="/auth/mentor/signup" prefetch={false}>
                            <Card className="p-8 hover:shadow-lg transition-all hover:scale-105 cursor-pointer rounded-xl border-2 border-primary/20">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    <h3 className="text-2xl font-semibold text-primary">Sign Up</h3>
                                    <p className="text-gray-600">New to SSRConnect? Create your student account here</p>
                                </div>
                            </Card>
                        </Link>
                    </div>
                  </section>



              </div>
          </main>

          <footer className="fixed bottom-4 w-full text-center text-sm text-gray-500">
              © 
              {' '}
              {new Date().getFullYear()}
              {' '}
              SSRConnect. All Rights Reserved.
          </footer>
      </div>
  );
};

export default PortalPage;
