/*
  Copyright 2017 Defier Labs Limited (UK)
  Licensed under the MIT License (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

 https://spdx.org/licenses/MIT.html

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  Author: Harnick Khera (Github.com/Hephyrius)
*/

import React, { useContext } from 'react';
import GlobalStyles from './../GlobalStyles';
import { Context } from './../store'
import clsx from 'clsx';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SyncIcon from '@material-ui/icons/Sync';

import SearchIcon from '@material-ui/icons/Search';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';


import { connect, disconnect, getAccount, getWeb3Caller, getChainID, donate } from "../Utils/Web3Handler"

export default function Bar() {
  const [state, dispatch] = useContext(Context);
  const classes = GlobalStyles();

  const [walletChainId, setWalletChainId] = React.useState(0);

  const handleConnection = () => {
    var web3 = connect()
    web3.then((value) => { dispatch({ type: 'web3_connected', payload: value }) });
    web3.then((value) => { dispatch({ type: 'web3_caller_connected', payload: value }) });
    dispatch({ type: 'set_connected', payload: true })
    dispatch({ type: 'set_connected_web3', payload: true })
    checkConnection()
    updateChainId()
  }

  const handleDisonnection = () => {
    dispatch({ type: 'web3_disconnected', payload: "" })
    dispatch({ type: 'set_connected_web3', payload: false })

    
    disconnect()
  }

  const checkConnection = () => {
    if (state.web3 !== null) {
      if (state.account === "0x00") {
        var account = getAccount(state.web3)
        account.then((value) => { dispatch({ type: 'set_account', payload: value }) });
      }
    }
  }

  const updateChainId = () => {
    if (state.connected && state.account !== "0x00") {
      getChainID(state.web3).then((value) => { setWalletChainId(value) })
    }
  }

  const handleDonation = () => {
    donate(state.web3)
  }

  const [values, setValues] = React.useState("");

  const handleChange = (prop) => (event) => {
    setValues(event.target.value);
  };

  const handleSearch = (e) => {
    dispatch({ type: 'set_account', payload: values });
    dispatch({ type: 'set_connected', payload: true });
    dispatch({ type: 'set_connected_web3', payload: false })
  }


  var connectbutton = []

  if (!state.connected) {
    connectbutton.push(<Button color="inherit" onClick={() => [handleConnection()]}> <AccountBalanceWalletIcon />  Connect To Wallet </Button>)
  }
  else if (state.connected && state.account === "0x00") {
    connectbutton.push(<IconButton color="inherit" aria-label="open drawer" onClick={checkConnection}><AccountBalanceWalletIcon /><SyncIcon /></IconButton>)
    connectbutton.push(<Button color="inherit" onClick={() => [handleDisonnection()]}> <ExitToAppIcon /> Disconnect </Button>)
    checkConnection()
  }
  else {
    connectbutton.push(<Typography variant="h10" noWrap> <AccountBalanceWalletIcon /> {state.account} </Typography>)
    connectbutton.push(<Button color="inherit" onClick={() => [handleDisonnection()]}> <ExitToAppIcon /> Disconnect </Button>)
  }


  return (
    <div className="appBar">
      <AppBar position="static" className={clsx(classes.appBar)} style={{ spacing: 1 }}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}> IDMChat💬 </Typography>
          <div className={classes.toolbarCenter}>
            <Button color="inherit" href="#" >Chat</Button>
          </div>
          <div className={classes.toolbarButtons}>
            {state.connected && state.account !=="0x00" && (
              <Button color="inherit" onClick={() => [handleDonation()]}> Donate to Dev </Button>
            )}
{connectbutton}
            {!state.connected && (<>
              <OutlinedInput
                id="outlined-adornment-amount"
                value={values.amount}
                onChange={handleChange('amount')}
                startAdornment={<InputAdornment position="start">📬</InputAdornment>}
                labelWidth={50}
                placeholder="View as Address"
              />

              <Button onClick={() => [handleSearch()]} variant="contained" color="secondary" className={classes.button} > <SearchIcon/> </Button>
            </>)}

            
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
