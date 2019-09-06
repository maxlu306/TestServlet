package com.max;

import java.io.IOException;
import java.io.Writer;
import java.math.BigInteger;
import java.net.URLDecoder;
import java.sql.Connection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class webServlet
 */
@WebServlet("/webServlet")
public class webServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	private DbManager db = new DbManager();
	private mxService service = new mxService();
	
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public webServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	private void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		System.out.println("processRequest");
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");  
		response.setCharacterEncoding("UTF-8");	
		

		String mxCmd=request.getParameter("mxCmd");
		String dbName=request.getParameter("dbName");
		String tabName=request.getParameter("tabName");
		String param=request.getParameter("param");		
		String [] params = new String[] {param};
	

		service.setParam(params);
		int event = service.sendCmd(mxCmd);
		if(event==0x11) {
			String [] datas = service.getResponse();
			createHTML(request, response, datas);
		}
	}
    
    
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		System.out.println("doGet!");
		
		processRequest(request, response);	
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//doGet(request, response);
		
		
		processRequest(request, response);	
	}
	
	protected void createHTML(HttpServletRequest request, HttpServletResponse response, String[] datas) throws ServletException, IOException{		

		Writer out = response.getWriter();
		System.out.println("createHTML");
		// shopping cart header
		out.write("<div class=\"row\">");
		out.write("<div class=\"col-md-4\"></div>");
		out.write("<div class=\"col-md-4\"><h3> 購物車清單 </h3></div>");
		out.write("<div class=\"col-md-4\"></div>");
		out.write("</div>");
		out.write("<hr>");
		
		// shopping list.
		for(String element : datas) {
			out.write("<div class=\"row\">");
			out.write("<div class=\"col-md-4\"></div>");
			out.write("<div class=\"col-md-4\">"+ element +"</div>");
			out.write("<div class=\"col-md-4\"></div>");
			out.write("</div>");
			out.write("<hr>");
		}
		out.flush();
		out.close();
		
	}
	
	protected byte[] hex2Byte(String hexString) {
		byte[] bytes = new byte[hexString.length() / 2];
		for (int i = 0; i < bytes.length; i++)
			bytes[i] = (byte) Integer.parseInt(hexString.substring(2 * i, 2 * i + 2), 16);
		return bytes;
	}	

}
