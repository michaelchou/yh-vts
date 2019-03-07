package com.yihuacomputer.cols.monitor;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

public class JsonUtils {
	public static final ObjectMapper om = new ObjectMapper();

	public static final Gson gson = new Gson();

	static{
		om.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
		om.setDateFormat(new SimpleDateFormat(DateUtils.STANDARD_TIMESTAMP));
	}
	public JsonUtils(){

	}


	public static <T> T inputStreamToObject(InputStream in, Class<T> classOfT) throws IOException {
		return gson.fromJson(JsonUtils.inputStreamToString(in), classOfT);
	}

	public static String toJsonWithGson(Object object){
		String jsonStr = "";
		try {
			jsonStr = gson.toJson(object);
		} catch (Exception e) {
			return jsonStr;
		}
		return jsonStr;
	}

	public static String inputStreamToString(InputStream in) throws IOException {
		byte[] buffer = new byte[4096];

		List<byte[]> lists = new ArrayList<byte[]>();
		int len;
		int count = 0;

		while ((len = in.read(buffer)) != -1) {
			byte[] temp = new byte[len];
			System.arraycopy(buffer, 0, temp, 0, len);
			lists.add(temp);
			count += len;
		}

		if(count>1024*1024){
			return null;
		}
		byte[] result = new byte[count];
		int destPos = 0;
		for (byte[] bytes : lists) {
			System.arraycopy(bytes, 0, result, destPos, bytes.length);
			destPos = destPos + bytes.length;
		}
		return new String(result, "UTF-8");
	}

	public static <T> T fromJson(String json, Class<T> classOfT) {
		try {
			om.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
			return om.readValue(json, classOfT);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public static String toJson(Object src) {
		String jsonStr = "";
		try {
			jsonStr = om.writeValueAsString(src);
		} catch (Exception e) {
			return jsonStr;
		}
		return jsonStr;
	}

	public static String stringToStringPath(String path, String fileName) {
		StringBuffer result = new StringBuffer();
		result.append(path);
		if (!(path.endsWith("\\") || path.endsWith("/"))) {
			result.append("/");
		}
		result.append(fileName);
		return result.toString();
	}

	public static String jsonValue(String json, String name) {
		String result = "";
		try {
			JsonNode jsonNode = om.readTree(json);
			result = jsonNode.get(name).toString();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		return result;
	}
}
