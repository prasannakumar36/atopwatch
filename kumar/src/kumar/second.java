package kumar;

import java.util.Scanner;

public class second {
	public static void main(String[] args) {
	
		
		int n=2;
		int count=0;
	
		for(int i=1;i<=n;i++)
		{
			for(int j=n; j>=1;j--)
			{
				if(i+j==n)
				{
					count++;
				}
			}
		}
		System.out.println(count);
	}
		
}
	