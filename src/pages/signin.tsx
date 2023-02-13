import Head from 'next/head'
import Image from 'next/image'
import { Fragment, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useGoogleLogin } from '@react-oauth/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import Nav from './nav'

import GoogleLogo from '../assets/google.png'
import KakaoLogo from '../assets/kakao.png'

export default function SignIn() {
  const [account, setAccount] = useState('')

  const getGoogleOAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse)
      await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      })
      .then((res: { data: { email: any } }) => {
        alert(res.data.email);
      })
      .catch((err: Error) => {
        alert("oAuth token expired");
        // window.location.assign("http://localhost:3000");
      });
    },
    onError: errorResponse => console.log(errorResponse)
  })

  const getKakaoOAuth = () => {
    const jsKey = "da67909b86ab4ecd2c6c0fe94c1d65b7"
    const Kakao = window.Kakao
    if (Kakao && !Kakao.isInitialized()) {
      Kakao.init(jsKey);
      console.log(Kakao.isInitialized())
    }

    Kakao.Auth.login({
      success() {
        Kakao.API.request({
          url: "/v2/user/me",
          success(res: any) {
            alert(JSON.stringify(res));
            const kakaoAccount = res.kakao_account;
            console.log(kakaoAccount);
          },
          fail(error: any) {
            console.log(error);
          },
        });
      },
      fail(error: any) {
        console.log(error);
      },
    });
  }

  return (
    <Fragment>
      <Head>
        <title>Annumity - Sign in</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
      </Head>

      <Nav />

      <main className='flex-el'>
        <div className="sign-title">Sign in</div>

        <div className="oAuth">
          <button className='google-btn' onClick={() => getGoogleOAuth()}>
            <Image className='google-logo' src={GoogleLogo} alt={''} />
            <div className="oauth-btn-text">구글로 로그인</div>
          </button>

          <button className='kakao-btn' onClick={() => getKakaoOAuth()}>
            <Image className='kakao-logo' src={KakaoLogo} alt={''} />
            <div className="oauth-btn-text">카카오로 로그인</div>
          </button>
        </div>

        { account ?
          <div className="card">
            <div className="">로그인 되었습니다</div>
            <button onClick={() => setAccount('false')}>로그아웃</button>
          </div>
        : null }
      </main>

    </Fragment>
  )
}