import {useEffect, useState} from 'react';
import firebase from 'firebase';
import {auth, storage, db} from './firebase.js';

export default function Header(props){

    const [progress,setProgress] = useState(0);

    const [file,setFile] = useState(null);

    useEffect(() =>{
        
    }, [])


    function criarConta(e){
        e.preventDefault();

        let email = document.getElementById('email-cadastro').value;
        let username = document.getElementById('user-cadastro').value;
        let senha = document.getElementById('senha-cadastro').value;
        //criar conta firebase
        auth.createUserWithEmailAndPassword(email, senha)
        .then((authUser)=>{
            authUser.user.updateProfile({
                displayName:username
            })
            alert('Conta criada');

            let modal = document.querySelector('.modalCriarConta');

             modal.style.display = "none";
        }).catch((error)=>{
            alert(error.message);
        })
        ;
        

        
    }

    function entrar(e){
        e.preventDefault();
        let email = document.getElementById('email-login').value;
        let senha = document.getElementById('senha-login').value;

        auth.signInWithEmailAndPassword(email, senha)
        .then((auth)=>{
            props.setUser(auth.user.displayName);
            window.location.href = "/home";
        }).catch((err)=>{
            alert(err.message);
        })
    }

    function modalCriarConta(e){
        e.preventDefault();
        let modal = document.querySelector('.modalCriarConta');

        modal.style.display = "block";
    }

    function logout(e){
        e.preventDefault();
        auth.signOut().then(function(val){
            props.setUser(null);
            window.location.href="/home"
        }).catch((err)=>{
            alert(err.message);
        })
    }

    function modalUpload(e){
        e.preventDefault();
        let modal = document.querySelector('.modalUpload');

        modal.style.display = "block";

        fecharModalUpload();
    }

    function fecharModalCriarConta(){
        let modal = document.querySelector('.modalCriarConta');

        modal.style.display = "none";
    }

    function fecharModalUpload(){
        let modal = document.querySelector('.modalUpload');

        modal.style.display = "none";
    }

    function uploadPost(e){
        e.preventDefault();

        let legendaPost = document.getElementById('legenda-upload').value;
        

        const uploadTask = storage.ref(`images/${file.name}`).put(file);

        uploadTask.on("state_change",function(snapshot){
            const progress = Math.round(snapshot.bytesTransferred/snapshot.totalBytes)*100;

            setProgress(progress)
        },function (error){

        }, function(){
            storage.ref("images").child(file.name).getDownloadURL()
            .then(function(url){
                db.collection('posts').add({
                    legenda: legendaPost,
                    Image: url,
                    userName: props.user,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                })

                setProgress(0);
                setFile(null);
                alert('Upload realizado com sucesso!');

                document.getElementById('form-upload').reset();

            })
        })
    }
    
    return(
        <div className="Header">

            <div className='modalCriarConta'>
                <div className="formCriarConta">
                    <div onClick={() => fecharModalCriarConta()} className="closeModalCriarConta">X</div>
                    <h2>Criar conta</h2>
                    <form onSubmit={(e) => criarConta(e)}>
                        <input id='email-cadastro' type="text" placeholder="Seu e-mail" />
                        <input id='user-cadastro' type='text' placeholder="Seu apelido" />
                        <input id='senha-cadastro' type="password" placeholder="Senha" />
                        <input type="submit" value="Criar conta" />
                    </form>
                </div>
            </div>

            <div className='modalUpload'>
                <div className="formUpload">
                    <div onClick={() => fecharModalUpload()} className="closeModalCriarConta">X</div>
                    <h2>Fazer upload</h2>
                    <form id='form-upload' onSubmit={(e) => uploadPost(e)}>
                        <progress id='progress-upload' value = {progress}></progress>
                        <input id='legenda-upload' type="text" placeholder="Legenda" />
                        <input onChange = {(e)=>setFile(e.target.files[0])}type="file" name="file"/>
                        <input type="submit" value="Publicar" />
                    </form>
                </div>
            </div>

            <div className="center">
                <div className='header_logo'>
                    <a href="home"><img src="https://logodownload.org/wp-content/uploads/2017/04/instagram-logo-14.png" /></a>
                </div>
                {
                    (props.user)?
                        <div className='header_logadoInfo'>
                            <span>Olá <b>{props.user}</b></span>
                            <a onClick={(e)=>modalUpload(e)} href="feed">Publicação</a>
                            <a onClick={(e)=>logout(e)} href="home">Sair</a>
                        </div>
                        :
                        <div className='header_loginform'>
                            <form onSubmit={(e)=> entrar(e)}>
                                <input id='email-login'type='text' placeholder='Login...' />
                                <input id='senha-login' type='password' placeholder='Senha...'/>
                                <input type='submit' name='acao' value='Entrar' />
                            </form>
                            <div className="btn_criarConta">
                                <a onClick={(e)=>modalCriarConta(e)} href="create-account">Criar conta</a>
                            </div>
                        </div>

                        
                }
            
            </div>
        </div>

    )
}