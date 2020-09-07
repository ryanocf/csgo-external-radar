#include "utils.hpp"

#define WIN32_MEAN_AND_LEAN
#include <Windows.h>

auto Utils::wstring_to_string(const std::wstring& wstring) -> std::string
{
	const uint32_t i_wstring_len = (uint32_t)wstring.length() + 1;
	const uint32_t i_len = WideCharToMultiByte(CP_ACP, 0, wstring.c_str(), i_wstring_len, 0, 0, 0, 0);
	std::string result(i_len, '\0');
	WideCharToMultiByte(CP_ACP, 0, wstring.c_str(), i_wstring_len, &result[0], i_len, 0, 0);
	return result;
}

auto Utils::find_in_string(const std::string& string, const std::string& find) -> bool
{
	if (string.empty() || find.empty())
		return false;

	if (string.find(find) != std::string::npos)
		return true;
	
	return false;
}