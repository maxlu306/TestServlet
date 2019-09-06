package com.max;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.nio.*;



public class mxService {	
	
	// golden param.
	private DbManager db = new DbManager();
	private String param [];
	private String response [];
	
	
	protected byte[] checkMxCmd(byte[] cmd) {				
		if(cmd.length < 3) { return null;}		// check cmd size.		 
		if(!(cmd[0] == 0x6D & cmd[1] == 0x78)) { return null; } // check mxcmd head
		int psize = cmd.length-3;
		if(cmd[2] != psize) { return null; } // check param size.
		
		byte pbuf[] = new byte[psize]; // reassign buffer.
		System.arraycopy(cmd, 3, pbuf, 0, psize);
		
		return pbuf;
	}	
	
	protected byte[] hex2Byte(String hexString) {
		byte[] bytes = new byte[hexString.length() / 2];
		for (int i = 0; i < bytes.length; i++)
			bytes[i] = (byte) Integer.parseInt(hexString.substring(2 * i, 2 * i + 2), 16);
		return bytes;
	}
	
	public void setParam(String[] param) {
		this.param = param;		
	}	
	
	public String[] getResponse(){ 
		return this.response;
	}	
	
	// return event value: 
	// 0x00 : command successed.
	// 0x01 : command failed.
	// 0x99 : unknown command.	
	// DataBase Data : 0x11 : bebuke(可不可). 0x12 : tp_tea(茶湯會)
	public int sendCmd(String cmdLine) {
		System.out.println("sendCmd");
		byte[] sourcmd = hex2Byte(cmdLine);
		
		byte[] cmd = checkMxCmd(sourcmd);		
		if(cmd == null) { return 0x99; }
		
		if(cmd.length<2) {return 0x01; }
		byte cmdtype = cmd[0];
		byte opcode = cmd[1];
		
		int event = 0x00; 
		byte storeId = 0;
		String tabName = "bebuke";
		switch(opcode) {
		case 0x01: // connect;
			System.out.println("DB Connect");
			boolean ret = db.getConnection();
			event = ret ? 0x00 : 0x01;
			break;	
		case 0x02:
			System.out.println("DB Disconnect");
			db.disConnection();
			event = 0x00;
			break;
			
		case 0x03:
			//storeId = cmd[2];
			System.out.println("readFromDB");
			this.response = db.showData(tabName);
			event = 0x11;
			break;
			
		case 0x04:
			//storeId = cmd[2];
			System.out.println("writeToDB");
			String data = this.param[0];
			if(data == null) {
				event = 0x01;
				break;
			}
			db.writeData(data, tabName);
			break;
		
		default: event = 0x99;
		}	
		
		return event;
	}
}
